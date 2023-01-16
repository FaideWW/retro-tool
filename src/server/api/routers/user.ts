import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  setDisplayName: protectedProcedure
    .input(z.object({ displayName: z.string() }))
    .mutation(({ ctx, input }) => {
      const user = ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: { displayName: input.displayName },
      });

      return user;
    }),
  editUser: protectedProcedure
    .input(z.object({ displayName: z.string() }))
    .mutation(({ ctx, input }) => {
      const user = ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: input,
      });

      return user;
    }),
});
