class BlogPostModel {
  id = null;
  title = null;
  content = null;
  creationDate = null;
  lastEditDate = null;
  creatorId = null;
  isFavorite = null;

  constructor(blogPost) {
    const {
      id,
      title,
      content,
      creationDate,
      lastEditDate,
      creatorId,
      isFavorite,
    } = blogPost;

    this.id = id;
    this.title = title;
    this.content = content;
    this.creationDate = creationDate;
    this.lastEditDate = lastEditDate;
    this.creatorId = creatorId;
    this.isFavorite = isFavorite;
  }
}
