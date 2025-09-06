import asyncHandler from '../middlewares/asyncHandler.js';

export class PostController {
  constructor(postService) {
    this.postService = postService;
  }

  getAllPosts = asyncHandler(async (req, res) => {
    const posts = await this.postService.getAllPosts();
    res.json(posts);
  });

  getPostBySlug = asyncHandler(async (req, res) => {
    const post = await this.postService.getPostBySlug(req.params.slug);
    res.json(post);
  });
  
  createPost = asyncHandler(async (req, res) => {
    // Assume que o autor é o usuário logado (admin)
    const newPost = await this.postService.createPost({ ...req.body, author: req.user._id });
    res.status(201).json(newPost);
  });

  updatePost = asyncHandler(async (req, res) => {
    const updatedPost = await this.postService.updatePost(req.params.slug, req.body);
    res.json(updatedPost);
  });

  deletePost = asyncHandler(async (req, res) => {
    await this.postService.deletePost(req.params.slug);
    res.status(204).send();
}); }