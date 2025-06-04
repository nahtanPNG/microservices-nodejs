import { broker } from "../broker.ts";

// Isolate messages using rabbitMq channels

export const orders = await broker.createChannel();

await orders.assertQueue("orders");
