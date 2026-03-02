variable "project_name" {
  description = "Name prefix for all resources"
  type        = string
}

variable "aws_region" {
  description = "AWS GovCloud region"
  type        = string
  default     = "us-gov-west-1"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.20.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
  default     = ["10.20.1.0/24", "10.20.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
  default     = ["10.20.11.0/24", "10.20.12.0/24"]
}

variable "container_port" {
  description = "Port exposed by the application container"
  type        = number
  default     = 3000
}

variable "desired_count" {
  description = "Desired number of ECS tasks"
  type        = number
  default     = 1
}

variable "ecs_cpu" {
  description = "CPU units for the ECS task"
  type        = number
  default     = 256
}

variable "ecs_memory" {
  description = "Memory (MB) for the ECS task"
  type        = number
  default     = 512
}

variable "db_name" {
  description = "Postgres database name"
  type        = string
  default     = "sandbox"
}

variable "db_user" {
  description = "Postgres master username"
  type        = string
  default     = "sandbox"
}

variable "db_password" {
  description = "Postgres master password"
  type        = string
  sensitive   = true
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  description = "RDS allocated storage (GB)"
  type        = number
  default     = 20
}

variable "s3_bucket_name" {
  description = "S3 bucket name for text storage"
  type        = string
}

variable "ecr_repo_name" {
  description = "ECR repository name"
  type        = string
  default     = "sandbox-app"
}

variable "image_tag" {
  description = "Container image tag"
  type        = string
  default     = "latest"
}

variable "alb_health_check_path" {
  description = "ALB target group health check path"
  type        = string
  default     = "/api/health"
}

variable "enable_ecr_lifecycle" {
  description = "Enable ECR lifecycle policy"
  type        = bool
  default     = true
}
