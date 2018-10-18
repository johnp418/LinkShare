variable "table_name" {}

variable "read_capacity" {
  default = 1
}

variable "write_capacity" {
  default = 1
}

variable "hash_key" {}

variable "range_key" {
  default = ""
}

variable "table_attributes" {
  type = "list"
}

variable "global_secondary_index" {
  type    = "map"
  default = {}
}
