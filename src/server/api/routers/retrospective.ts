import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { z } from "zod";
import { env } from "../../../env/server.mjs";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const retrospectiveRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        hostCanParticipate: z.boolean().optional(),
        votesPerParticipant: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      let slug = nanoid(Number(env.RETRO_SLUG_LENGTH));

      // ensure we have a unique slug; repeatedly generate new ones until we
      // find one
      let duplicate = await ctx.prisma.retrospective.findUnique({
        where: { slug },
      });
      while (duplicate !== null) {
        slug = nanoid(Number(env.RETRO_SLUG_LENGTH));
        duplicate = await ctx.prisma.retrospective.findUnique({
          where: { slug },
        });
      }

      const retro = await ctx.prisma.retrospective.create({
        data: {
          title: input.title,
          slug,
          ownerId: ctx.session.user.id,
          hostId: ctx.session.user.id,
          // owner: { connect: { id: ctx.session.user.id } },
          // host: { connect: { id: ctx.session.user.id } },
          hostCanParticipate: input.hostCanParticipate,
          votesPerParticipant: input.votesPerParticipant,
        },
      });

      return retro;
    }),
  myRetros: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.retrospective.findMany({
      where: { ownerId: ctx.session.user.id },
      include: {
        host: { select: { displayName: true } },
        _count: {
          select: { participants: true },
        },
      },
    });
  }),
  getBySlug: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(({ ctx, input: { slug } }) => {
      return ctx.prisma.retrospective.findUnique({
        where: { slug },
        include: {
          participants: true,
        },
      });
    }),
  joinById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input: { id } }) => {
      return ctx.prisma.retrospective.update({
        where: { id },
        data: {
          participants: { connect: { id: ctx.session.user.id } },
        },
      });
    }),
  changeSettingsById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        hostCanParticipate: z.boolean(),
        votesPerParticipant: z.number(),
      })
    )
    .mutation(({ ctx, input: { id, ...settings } }) => {
      return ctx.prisma.retrospective.update({
        where: { id },
        data: settings,
      });
    }),
  changeHostById: protectedProcedure
    .input(z.object({ id: z.string(), newHostId: z.string() }))
    .mutation(async ({ ctx, input: { id, newHostId } }) => {
      const retro = await ctx.prisma.retrospective.findUnique({
        where: { id },
      });

      if (retro === null) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Retro not found",
        });
      }

      if (retro.hostId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not the host",
        });
      }

      return ctx.prisma.retrospective.update({
        where: { id },
        data: {
          host: { connect: { id: newHostId } },
          participants: { connect: { id: retro.hostId } },
        },
      });
    }),
  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum([
          "UNSTARTED",
          "REFLECTION",
          "GROUPING",
          "VOTING",
          "DISCUSSION",
          "ENDED",
        ]),
        startedAt: z.date().optional(),
        endedAt: z.date().optional(),
      })
    )
    .mutation(({ ctx, input: { id, status, startedAt, endedAt } }) => {
      return ctx.prisma.retrospective.update({
        where: { id },
        data: { status, startedAt, endedAt },
      });
    }),
});
