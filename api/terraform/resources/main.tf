provider "aws" {
  region = "us-west-2"

  endpoints {
    dynamodb = "http://localhost:8000"
  }
}

resource "aws_dynamodb_table" "link-table" {
  name           = "Link"
  hash_key       = "Id"
  read_capacity  = 1
  write_capacity = 1

  attribute = [
    {
      name = "Id"
      type = "S"
    },
    {
      name = "Url"
      type = "S"
    },
  ]

  global_secondary_index = {
    name            = "LinkUrlIndex"
    hash_key        = "Id"
    range_key       = "Url"
    write_capacity  = 1
    read_capacity   = 1
    projection_type = "ALL"
  }
}

resource "aws_dynamodb_table" "user_repo_table" {
  name           = "UserRepository"
  hash_key       = "Id"
  read_capacity  = 1
  write_capacity = 1

  attribute = [
    {
      name = "Id"
      type = "S"
    },
    {
      name = "UserId"
      type = "S"
    },
  ]

  global_secondary_index = {
    name            = "UserRepoIndex"
    hash_key        = "Id"
    range_key       = "UserId"
    write_capacity  = 1
    read_capacity   = 1
    projection_type = "ALL"
  }
}

resource "aws_dynamodb_table" "user-repository-link-table" {
  name           = "UserRepositoryLink"
  hash_key       = "Id"
  range_key      = "UserId"
  read_capacity  = 1
  write_capacity = 1

  attribute = [
    {
      name = "Id"
      type = "S"
    },
    {
      name = "UserId"
      type = "S"
    },
    {
      name = "RepositoryId"
      type = "S"
    },
  ]

  global_secondary_index = {
    name            = "UserRepoIndex"
    hash_key        = "RepositoryId"
    range_key       = "UserId"
    write_capacity  = 1
    read_capacity   = 1
    projection_type = "ALL"
  }
}

module "user_table" {
  source     = "../modules/dynamodb"
  table_name = "User"
  hash_key   = "Id"

  table_attributes = [
    {
      name = "Id"
      type = "S"
    },
  ]
}

# module "user_vote_table" {
#   source = "../modules/dynamodb"
#   table_name = "UserLinkVote"
#   hash_key   = "UserId"
#   range_key  = "LinkId"
#   table_attributes = [
#     {
#       name = "UserId"
#       type = "S"
#     },
#     {
#       name = "LinkId"
#       type = "S"
#     },
#   ]
# }

