"use strict";
exports.__esModule = true;
var ThreadSorter = (function () {
    function ThreadSorter() {
        var _this = this;
        this.sortThread = function (document) {
            _this.initializeThreadVars(document);
            var fragReplies = document.createDocumentFragment();
            var fragNoReplies = document.createDocumentFragment();
            var sortedPosts = _this.postsWithReplies.sort(_this.sortByNumReplies);
            // Build the sorted posts as its own fragment
            sortedPosts.forEach(fragReplies.appendChild, fragReplies);
            // Because posts without replies don't need to be sorted,
            // just build them as their own fragment without any sorting
            _this.postsWithoutReplies.forEach(fragNoReplies.appendChild, fragNoReplies);
            _this.thread.appendChild(fragReplies);
            _this.thread.appendChild(fragNoReplies);
        };
        this.initializeThreadVars = function (document) {
            _this.thread = document.getElementsByClassName('thread')[0];
            if (!(_this.thread instanceof HTMLDivElement)) {
                var thread = _this.thread;
                throw new Error("Expected thread to be an HTMLDivElement, but it was " + (thread && thread.constructor && thread || thread));
            }
            ;
            _this.histogram = _this.generateHistogram(_this.backlinks(document));
            _this.postsWithReplies = _this.getPostsWithReplies();
            _this.postsWithoutReplies = _this.getPostsWithoutReplies();
        };
        this.backlinks = function (document) {
            // These are posts with replies. Not the number of backlinks.
            return document.getElementsByClassName('backlink');
        };
        this.generateHistogram = function (posts) {
            return Array.from(posts).reduce(function (histogram, post) {
                var postId = post.parentNode.parentNode.parentNode.id;
                histogram["" + postId] = post.childNodes.length;
                return histogram;
            }, {});
        };
        this.getPostsWithReplies = function () {
            return Array.from(_this.thread.children).filter(function (post) {
                return _this.histogram[post.id];
            });
        };
        this.getPostsWithoutReplies = function () {
            return Array.from(_this.thread.children).filter(function (post) {
                return !(_this.histogram[post.id]);
            });
        };
        this.sortByNumReplies = function (a, b) {
            var aReplies = _this.histogram["" + a.id];
            var bReplies = _this.histogram["" + b.id];
            if (aReplies === null || bReplies === null) {
                return 0;
            }
            if (aReplies < bReplies) {
                return 1;
            }
            else if (aReplies > bReplies) {
                return -1;
            }
            else if (aReplies === bReplies) {
                return 0;
            }
            return 0;
        };
    }
    return ThreadSorter;
}());
exports["default"] = ThreadSorter;
