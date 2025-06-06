import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as docker from "@pulumi/docker-build";

// ECR - Elastic Container Register -> Docker images management
const ordersECRRepository = new awsx.ecr.Repository("orders-ecr", {
  forceDelete: true,
});

const ordersECRToken = aws.ecr.getAuthorizationTokenOutput({
  registryId: ordersECRRepository.repository.registryId,
});

export const ordersDockerImage = new docker.Image("orders-image", {
  tags: [pulumi.interpolate`${ordersECRRepository.url}:latest`],
  context: {
    location: "../app-orders",
  },
  push: true,
  platforms: ["linux/amd64"],
  registries: [
    {
      address: ordersECRRepository.repository.repositoryUrl, //Image address
      username: ordersECRToken.userName,
      password: ordersECRToken.password,
    },
  ],
});

// Deploy Time -> ECS + Fargate(Receive a dockerfile and deploy)
const cluster = new awsx.classic.ecs.Cluster("app-cluster");

const ordersService = new awsx.classic.ecs.FargateService("fargate-orders", {
  cluster,
  desiredCount: 1,
  waitForSteadyState: false,
  taskDefinitionArgs: {
    container: {
      image: ordersDockerImage.ref,
      cpu: 256,
      memory: 512,
    },
  },
});
