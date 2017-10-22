# youarenotalone

## What a user should be able to do (ranked by priority)
- View comments/stories
- Add comments (post their story)
- View statistics (such as time posted, amount of posts, etc)
- View different topics
- Add topics
- Intelligently search topics (natural language conversion to matching single topics)

## Technical Stuff
- Managed by GCP - Firebase
- Domain isn't needed because appspot (GCP) can host the web stuff temporarily
- comments should probably be managed by CloudSQL
- different topics should be different tables? different columns for raw data and metadata (datetime, etc)
