export default class Likes {
  constructor() {
    this.likes = [];
  }
  addLike(id, title, author, img) {
    const like = {
      id,
      title,
      author,
      img,
    };
    this.likes.push(like);
    // Persis data in localStorage
    this.persistData();
    return like;
  }
  removeLike(id) {
    const index = this.likes.findIndex((element) => element.id === id);
    this.likes.splice(index, 1);
    // Persis data in localStorage
    this.persistData();
  }
  isLiked(id) {
    // Return true if there is liked, otherwise false.
    return this.likes.findIndex((element) => element.id === id) !== -1;
  }
  getNumLikes() {
    return this.likes.length;
  }
  persistData() {
    localStorage.setItem("likes", JSON.stringify(this.likes));
  }
  readStorage() {
    const storage = JSON.parse(localStorage.getItem("likes"));
    // Restore likes from localStorage
    if (storage) this.likes = storage;
  }
}
