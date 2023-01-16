import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { exclude } from "../utils";

export const retroItemRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        retroId: z.string(),
        column: z.enum(["POSITIVE", "NEGATIVE"]),
        text: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.retroItem.create({
        data: {
          column: input.column,
          text: input.text,

          submitter: { connect: { id: ctx.session.user.id } },
          retro: { connect: { id: input.retroId } },
        },
      });
    }),
  getByRetroId: protectedProcedure
    .input(z.object({ retroId: z.string() }))
    .query(async ({ ctx, input: { retroId } }) => {
      const items = await ctx.prisma.retroItem.findMany({
        where: { retroId },
      });

      return items.map((item) => exclude(item, ["submitterId"]));
    }),
  getColumnCountsByRetroId: protectedProcedure
    .input(
      z.object({
        retroId: z.string(),
        columns: z.array(z.enum(["POSITIVE", "NEGATIVE"])),
      })
    )
    .query(({ ctx, input: { retroId, columns } }) => {
      return Promise.all(
        columns.map((column) =>
          ctx.prisma.retroItem.count({ where: { retroId, column } })
        )
      );
    }),
  getMyRetroItems: protectedProcedure
    .input(z.object({ retroId: z.string() }))
    .query(({ ctx, input: { retroId } }) => {
      return ctx.prisma.retroItem.findMany({
        where: { retroId, submitterId: ctx.session.user.id },
      });
    }),
  getGroupedItems: protectedProcedure
    .input(z.object({ retroId: z.string() }))
    .query(({ ctx, input: { retroId } }) => {
      return ctx.prisma.retroItem.findMany({
        where: { retroId, parentId: null },
        include: { children: true },
      });
    }),
  getRankedGroups: protectedProcedure
    .input(z.object({ retroId: z.string() }))
    .query(({ ctx, input: { retroId } }) => {
      return ctx.prisma.retroItem.findMany({
        where: { retroId, parentId: null },
        include: {
          children: true,
          comments: {
            orderBy: { createdAt: "asc" },
            include: {
              author: { select: { displayName: true } },
            },
          },
        },
        orderBy: { voteCount: "desc" },
      });
    }),
  groupItem: protectedProcedure
    .input(
      z.object({
        parentId: z.string(),
        childId: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { parentId, childId } }) => {
      const parent = await ctx.prisma.retroItem.findUnique({
        where: { id: parentId },
        include: {
          retro: {
            select: {
              hostId: true,
              participants: { select: { id: true } },
            },
          },
          children: true,
        },
      });
      const child = await ctx.prisma.retroItem.findUnique({
        where: { id: childId },
        include: {
          children: true,
        },
      });

      if (parent === null) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Parent not found",
        });
      }
      if (child === null) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Child not found",
        });
      }

      if (
        parent.retro.hostId !== ctx.session.user.id &&
        parent.retro.participants.every(({ id }) => id !== ctx.session.user.id)
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not a host or participant of this retro",
        });
      }

      if (parent.retroId !== child.retroId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Items are not part of the same retro",
        });
      }

      // A circular relationship would be created if the parent is already a
      // child of the child.
      const createsCircularRelation = child.children.find(
        ({ id: subChildId }) => subChildId === parentId
      );

      if (createsCircularRelation) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This grouping would create a circular relationship",
        });
      }

      return ctx.prisma.retroItem.update({
        where: { id: parentId },
        data: {
          children: { connect: { id: childId } },
        },
      });
    }),
  vote: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        upOrDown: z.enum(["UP", "DOWN"]),
      })
    )
    .mutation(async ({ ctx, input: { id, upOrDown } }) => {
      const item = await ctx.prisma.retroItem.findUnique({
        where: { id },
        include: {
          retro: {
            select: {
              hostCanParticipate: true,
              hostId: true,
              participants: { select: { id: true } },
            },
          },
        },
      });

      if (item === null) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Item not found",
        });
      }

      const canVote =
        (item.retro.hostCanParticipate &&
          item.retro.hostId === ctx.session.user.id) ||
        item.retro.participants.some(({ id }) => id === ctx.session.user.id);

      if (!canVote) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not a participant in this retro",
        });
      }

      return ctx.prisma.retroItem.update({
        where: { id },
        data: {
          voteCount: upOrDown === "DOWN" ? { decrement: 1 } : { increment: 1 },
        },
      });
    }),
});
