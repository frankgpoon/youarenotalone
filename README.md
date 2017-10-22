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



## TODO LIST

  1. Make a FireBase project (Frank)
  
  2. Figure out how to host a static/dynamic site/webpage (Anyone)
  
  3. Figure out how to send POST requests to our webpage.
    3.1 Figure out how to send messages/paragraphs to our webpage
    3.2 Store these Messages
  
  4. Figure out how to display our saved paragraphs
  
  5. ???
