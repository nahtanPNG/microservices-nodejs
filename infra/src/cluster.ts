import * as awsx from "@pulumi/awsx";

// Deploy Time -> ECS + Fargate(Receive a dockerfile and deploy)
export const cluster = new awsx.classic.ecs.Cluster("app-cluster");
