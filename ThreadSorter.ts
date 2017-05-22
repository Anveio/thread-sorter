interface Histogram { [index:string]: number | null}

export default class ThreadSorter {
  private thread: Element;
  private histogram: Histogram;
  private postsWithReplies: Element[];
  private postsWithoutReplies: Element[];

  constructor() {}

  public sortThread = (document: Document) => {
    this.initializeThreadVars(document);
    const fragReplies = document.createDocumentFragment();
    const fragNoReplies = document.createDocumentFragment();

    const sortedPosts = this.postsWithReplies.sort(this.sortByNumReplies);
    
    // Build the sorted posts as its own fragment
    sortedPosts.forEach(fragReplies.appendChild, fragReplies);
    // Because posts without replies don't need to be sorted,
    // just build them as their own fragment without any sorting
    this.postsWithoutReplies.forEach(fragNoReplies.appendChild, fragNoReplies)

    this.thread.appendChild(fragReplies);
    this.thread.appendChild(fragNoReplies);
  }

  private initializeThreadVars = (document: Document): void => {
    this.thread = document.getElementsByClassName('thread')[0];
    if (!(this.thread instanceof HTMLDivElement)) {
      const thread = this.thread
      throw new Error(`Expected thread to be an HTMLDivElement, but it was ${thread && thread.constructor && thread || thread}`);
    };

    this.histogram = this.generateHistogram(this.backlinks(document));
    this.postsWithReplies = this.getPostsWithReplies();
    this.postsWithoutReplies = this.getPostsWithoutReplies();
  }

  private backlinks = (document: Document) => {
    // These are posts with replies. Not the number of backlinks.
    return document.getElementsByClassName('backlink');
  }

  private generateHistogram = (posts: HTMLCollection) => {
    return Array.from(posts).reduce((histogram: Histogram, post: Node) => {
      const postId: string = post.parentNode.parentNode.parentNode.id;

      histogram[`${postId}`] = post.childNodes.length;
      return histogram;
    }, {})
  };

  private getPostsWithReplies = (): Element[] => {
    return Array.from(this.thread.children).filter((post: HTMLDivElement) => {
      return this.histogram[post.id]
    });
  }

  private getPostsWithoutReplies = (): Element[] => {
    return Array.from(this.thread.children).filter((post: HTMLDivElement) => {
      return !(this.histogram[post.id])
    });
  }

  private sortByNumReplies = (a: Element, b: Element) => {
    const aReplies = this.histogram[`${a.id}`]
    const bReplies = this.histogram[`${b.id}`]

    if (aReplies === null || bReplies === null) {
      return 0;
    }

    if (aReplies < bReplies) {
      return 1;
    } else if (aReplies > bReplies) {
      return -1;
    } else if (aReplies === bReplies){
      return 0;
    }
    return 0;
  }
}