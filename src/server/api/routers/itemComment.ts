import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const itemCommentRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        retroId: z.string(),
        parentId: z.string(),
        text: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { retroId, parentId, text } }) => {
      const retro = await ctx.prisma.retrospective.findUnique({
        where: { id: retroId },
        select: { hostId: true, participants: { select: { id: true } } },
      });

      if (retro === null) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Retro not found",
        });
      }

      console.log(retro.hostId, ctx.session.user.id);

      if (
        retro.hostId !== ctx.session.user.id &&
        retro.participants.every(({ id }) => id !== ctx.session.user.id)
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You cannot comment on this item",
        });
      }

      return ctx.prisma.itemComment.create({
        data: {
          parentItem: { connect: { id: parentId } },
          author: { connect: { id: ctx.session.user.id } },
          text,
        },
      });
    }),
  edit: protectedProcedure
    .input(z.object({ id: z.string(), text: z.string() }))
    .mutation(async ({ ctx, input: { id, text } }) => {
      const item = await ctx.prisma.itemComment.findUnique({
        where: { id },
        select: { authorId: true },
      });
      if (item === null) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Item not found",
        });
      }
      if (item.authorId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You cannot edit this item",
        });
      }

      return ctx.prisma.itemComment.update({ where: { id }, data: { text } });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input: { id } }) => {
      const item = await ctx.prisma.itemComment.findUnique({
        where: { id },
        select: { authorId: true },
      });
      if (item === null) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Item not found",
        });
      }
      if (item.authorId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You cannot edit this item",
        });
      }

      return ctx.prisma.itemComment.delete({ where: { id } });
    }),
});
