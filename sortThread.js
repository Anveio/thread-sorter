

var sortThread = () => {
  if (!HTMLCollection.prototype.filter || !HTMLCollection.prototype.reduce) {
    HTMLCollection.prototype.filter = Array.prototype.filter
    HTMLCollection.prototype.reduce = Array.prototype.reduce
  }

  const generateHistogram = (posts) => {
    return posts.reduce((counter, post) => {
      const postId = post.parentNode.parentNode.parentNode.id
      counter[`${postId}`] = post.childNodes.length;
      return counter;
    }, {})
  }

  const sortByNumReplies = (a, b) => {
    const aReplies = histogram[`${a.id}`]
    const bReplies = histogram[`${b.id}`]

    if (aReplies < bReplies) {
      return 1;
    } else if (aReplies > bReplies) {
      return -1;
    } else if (aReplies === bReplies){
      return 0;
    }

    return 0;
  }

  const findDifference = (arrayLarger, arraySmaller) => {
    const superSet = new Set([].slice.call(arrayLarger));
    const subSet = new Set([].slice.call(arraySmaller));

    for (let el of superSet) {
      if (subSet.has(el)) {
        superSet.delete(el)
      }
    }

    return Array.from(superSet)
  }

  const backlinks = document.getElementsByClassName('backlink');
  const histogram = generateHistogram(backlinks);
  let thread = document.getElementsByClassName('thread')[0]
  const filteredThread = thread.children.filter(post => {
    return histogram[`${post.id}`];
  })

  const fullThreadAsArray = Array.from(findDifference(thread.children, filteredThread))
  const filteredThreadAsArray = Array.from(filteredThread);
  let fragFiltered = document.createDocumentFragment();
  let fragFull = document.createDocumentFragment();
  
  const sortedThread = filteredThreadAsArray.sort(sortByNumReplies);

  sortedThread.forEach(fragFiltered.appendChild, fragFiltered);
  // const fragFiltered = sortedThread.reduce((frag, post) => {
  //   frag.appendChild(post);
  //   return frag;
  // }, document.createDocumentFragment());

  fullThreadAsArray.forEach(fragFull.appendChild, fragFull)
  console.log(fragFiltered)
  thread.appendChild(fragFiltered);
  thread.appendChild(fragFull)
}

sortThread();

