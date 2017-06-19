interface Histogram { [index: string]: number | null }

class PostContainer extends Node {
  id: string;
}

export default class ThreadSorter {
  private thread: Element;
  private histogram: Histogram;
  private postsWithReplies: Element[];
  private postsWithoutReplies: Element[];

  public sort = (document: Document) => {
    this.initializeThreadVars(document);
    const repliedFrag = document.createDocumentFragment();
    const noRepliesFrag = document.createDocumentFragment();

    let sortedPosts = this.postsWithReplies.sort(this.sortByNumReplies);

    // Build the sorted posts as its own fragment
    sortedPosts.forEach(repliedFrag.appendChild, repliedFrag);
    // Posts without replies don't need to be sorted,
    // so just build them as their own fragment without any sorting
    this.postsWithoutReplies.forEach(noRepliesFrag.appendChild, noRepliesFrag);

    this.thread.appendChild(repliedFrag);
    this.thread.appendChild(noRepliesFrag);
  };

  private initializeThreadVars = (document: Document): void => {
    this.thread = document.getElementsByClassName("thread")[0];

    this.histogram = this.generateHistogram(this.backlinks(document));
    this.postsWithReplies = this.getPostsWithReplies();
    this.postsWithoutReplies = this.getPostsWithoutReplies();
  };

  private backlinks = (document: Document): HTMLCollectionOf<Element> => {
    // These are posts with replies. Not the number of backlinks.
    return document.getElementsByClassName("backlink");
  };

  private generateHistogram = (posts: HTMLCollection) => {
    return Array.from(posts).reduce((histogram: Histogram, post: Node) => {
      const postId = this.extractId(post);
      histogram[`${postId}`] = post.childNodes.length;
      return histogram;
    }, {});
  };

  private extractId = (post: Node): string => {
    let postId: string;
    if (
      post.parentNode &&
      post.parentNode.parentNode &&
      post.parentNode.parentNode.parentNode &&
      post.parentNode.parentNode.parentNode
    ) {
      postId = (post.parentNode.parentNode.parentNode as PostContainer).id;
    } else {
      throw new Error(`Error getting id of post`);
    }

    return postId;
  };

  private getPostsWithReplies = (): Element[] => {
    return Array.from(this.thread.children).filter((post: HTMLDivElement) => {
      return this.histogram[post.id];
    });
  };

  private getPostsWithoutReplies = (): Element[] => {
    return Array.from(this.thread.children).filter((post: HTMLDivElement) => {
      return !this.histogram[post.id];
    });
  };

  private sortByNumReplies = (a: Element, b: Element) => {
    const aReplies = this.histogram[`${a.id}`];
    const bReplies = this.histogram[`${b.id}`];

    if (aReplies === null || bReplies === null) {
      return 0;
    }

    return aReplies - bReplies;
  };
}
