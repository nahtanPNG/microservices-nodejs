import "@opentelemetry/auto-instrumentations-node/register";

import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import { trace } from "@opentelemetry/api";
import { setTimeout } from "node:timers/promises";
import { z } from "zod";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { channels } from "../broker/channels/index.ts";
import { db } from "../db/client.ts";
import { schema } from "../db/schema/index.ts";
import { randomUUID } from "node:crypto";
import { dispatchOrderCreated } from "../broker/messages/order-created.ts";
import { tracer } from "../tracer/tracer.ts";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(fastifyCors, {
  origin: "*",
});

app.get("/health", () => {
  return "OK";
});

app.post(
  "/orders",
  {
    schema: {
      body: z.object({
        amount: z.coerce.number(),
      }),
    },
  },
  async (request, reply) => {
    const { amount } = request.body;

    console.log("Creating an order with amount", amount);

    const orderId = randomUUID();

    await db.insert(schema.orders).values({
      id: orderId,
      customerId: "a6090a7a-8cc5-4b9a-9eb9-6d98d23fb890",
      amount: amount,
    });

    // Tracing a specific block of code
    // const span = tracer.startSpan("I think the error is here!");
    // await setTimeout(2000);
    // span.end();

    trace.getActiveSpan()?.setAttribute("order_id", orderId);

    dispatchOrderCreated({
      orderId: orderId,
      amount: amount,
      customer: {
        id: "a6090a7a-8cc5-4b9a-9eb9-6d98d23fb890",
      },
    });

    return reply.status(201).send();
  }
);

app.listen({ host: "0.0.0.0", port: 3333 }).then(() => {
  console.log("[Orders] HTTP Server Running");
});
