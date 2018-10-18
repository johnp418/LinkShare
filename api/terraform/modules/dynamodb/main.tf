provider "aws" {
  region = "us-west-2"

  endpoints {
    dynamodb = "http://localhost:8000"
  }
}

resource "aws_dynamodb_table" "basic-dynamodb-table" {
  name           = "${var.table_name}"
  read_capacity  = "${var.read_capacity}"
  write_capacity = "${var.write_capacity}"
  hash_key       = "${var.hash_key}"
  range_key      = "${var.range_key}"
  attribute      = "${var.table_attributes}"

  # global_secondary_index {
  #   name            = "GameTitleIndex"
  #   hash_key        = "GameTitle"
  #   range_key       = "TopScore"
  #   write_capacity  = 10
  #   read_capacity   = 10
  #   projection_type = "ALL"

  #   # non_key_attributes = ["UserId"]
  # }

  # tags {
  #   Name        = "dynamodb-table-1"
  #   Environment = "development"
  # }
}
