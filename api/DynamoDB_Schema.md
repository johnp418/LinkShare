# DynamoDB Table Schema

## Link

- Id (Partition Key)
- Name (Sort Key) (Use Category later?)
- Popularity
- Like
- Dislike
- Icon
- Url

## User

- Id (Partition Key)
- Name
- RepoVote
- LinkVote

## UserRepository

- Id (Partition Key)
- UserId (Sort Key)
- Root
- Title
- Category
- Like
- Dislike
- AddDate
- LastModified

## UserRepositoryLink

- Id (Partition Key)
- UserId (Sort Key)
- RepositoryId (Sort Key)
- LinkId (Sort Key)
- Title
- Type
- Children
- AddDate
- LastModified

## UserVote

- UserId (Partition Key)
- LinkId (Sort Key)
- Like
- Dislike
