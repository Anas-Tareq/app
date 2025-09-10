import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Plus, Edit, Trash2, FileText, Eye, Calendar,
  Save, X, BookOpen, Globe, Tag
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const BlogManagement = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: {
      en: '',
      ar: '',
      fr: ''
    },
    content: {
      en: '',
      ar: '',
      fr: ''
    },
    excerpt: {
      en: '',
      ar: '',
      fr: ''
    },
    featured_image: '',
    author: '',
    published: false,
    featured: false,
    tags: []
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/admin/blog`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPost) {
        await axios.put(`${API}/admin/blog/${editingPost.id}`, formData);
      } else {
        await axios.post(`${API}/admin/blog`, formData);
      }
      
      fetchPosts();
      resetForm();
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Error saving post: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      featured_image: post.featured_image || '',
      author: post.author,
      published: post.published,
      featured: post.featured,
      tags: post.tags || []
    });
    setShowForm(true);
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await axios.delete(`${API}/admin/blog/${postId}`);
        fetchPosts();
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Error deleting post');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: {
        en: '',
        ar: '',
        fr: ''
      },
      content: {
        en: '',
        ar: '',
        fr: ''
      },
      excerpt: {
        en: '',
        ar: '',
        fr: ''
      },
      featured_image: '',
      author: '',
      published: false,
      featured: false,
      tags: []
    });
    setEditingPost(null);
    setShowForm(false);
  };

  const updateTranslation = (field, lang, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: value
      }
    }));
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading blog posts...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">Blog Management</h2>
          <p className="text-light-gray">إدارة مقالات "المصدر" - The Source</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)} 
          className="primary-button"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Article
        </Button>
      </div>

      {showForm && (
        <Card className="elyvra-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              {editingPost ? 'Edit Article' : 'New Article'}
            </CardTitle>
            <CardDescription>
              {editingPost ? 'Update article content' : 'Create a new educational article for The Source'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                  <TabsTrigger value="seo">SEO & Media</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4">
                  <Tabs defaultValue="en" className="w-full">
                    <TabsList>
                      <TabsTrigger value="en">English</TabsTrigger>
                      <TabsTrigger value="ar">العربية</TabsTrigger>
                      <TabsTrigger value="fr">Français</TabsTrigger>
                    </TabsList>

                    {['en', 'ar', 'fr'].map(lang => (
                      <TabsContent key={lang} value={lang} className="space-y-4">
                        <div>
                          <Label>Article Title</Label>
                          <Input
                            value={formData.title[lang]}
                            onChange={(e) => updateTranslation('title', lang, e.target.value)}
                            placeholder={`Article title in ${lang}`}
                            required={lang === 'en'}
                          />
                        </div>
                        
                        <div>
                          <Label>Excerpt</Label>
                          <Textarea
                            value={formData.excerpt[lang]}
                            onChange={(e) => updateTranslation('excerpt', lang, e.target.value)}
                            placeholder="Brief article summary"
                            rows={3}
                          />
                        </div>

                        <div>
                          <Label>Article Content</Label>
                          <Textarea
                            value={formData.content[lang]}
                            onChange={(e) => updateTranslation('content', lang, e.target.value)}
                            placeholder="Full article content (Markdown supported)"
                            rows={12}
                            required={lang === 'en'}
                          />
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                  <div>
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      value={formData.author}
                      onChange={(e) => setFormData({...formData, author: e.target.value})}
                      placeholder="Author name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={formData.tags.join(', ')}
                      onChange={(e) => {
                        const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
                        setFormData({...formData, tags});
                      }}
                      placeholder="nutrition, supplements, fitness, health"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="published"
                        checked={formData.published}
                        onChange={(e) => setFormData({...formData, published: e.target.checked})}
                      />
                      <Label htmlFor="published">Published</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={formData.featured}
                        onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                      />
                      <Label htmlFor="featured">Featured Article</Label>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="seo" className="space-y-4">
                  <div>
                    <Label htmlFor="featured_image">Featured Image URL</Label>
                    <Input
                      id="featured_image"
                      value={formData.featured_image}
                      onChange={(e) => setFormData({...formData, featured_image: e.target.value})}
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>

                  {formData.featured_image && (
                    <div>
                      <Label>Image Preview</Label>
                      <img 
                        src={formData.featured_image} 
                        alt="Featured" 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button type="submit" className="primary-button">
                  <Save className="w-4 h-4 mr-2" />
                  {editingPost ? 'Update Article' : 'Publish Article'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Posts List */}
      <div className="grid gap-6">
        {posts.map((post) => (
          <Card key={post.id} className="elyvra-card">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                {post.featured_image && (
                  <img 
                    src={post.featured_image} 
                    alt={post.title.en}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {post.title.en}
                      </h3>
                      <p className="text-light-gray text-sm mt-1">
                        By {post.author} • {new Date(post.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-light-gray text-sm mt-2">
                        {post.excerpt.en?.substring(0, 150)}...
                      </p>
                      <div className="flex items-center space-x-2 mt-3">
                        <Badge variant={post.published ? "default" : "secondary"}>
                          {post.published ? 'Published' : 'Draft'}
                        </Badge>
                        {post.featured && (
                          <Badge variant="secondary">
                            <BookOpen className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <Tag className="w-3 h-3 text-light-gray" />
                            <span className="text-xs text-light-gray">
                              {post.tags.slice(0, 2).join(', ')}
                              {post.tags.length > 2 && ` +${post.tags.length - 2}`}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-2 text-sm text-light-gray">
                      <Globe className="w-4 h-4" />
                      <span>
                        Languages: {Object.keys(post.title).filter(lang => post.title[lang]).join(', ')}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(post)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(post.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {posts.length === 0 && (
        <Card className="elyvra-card">
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto text-light-gray mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Articles Found</h3>
            <p className="text-light-gray mb-6">
              Start building your content library with educational articles about supplements, wellness, and beauty.
            </p>
            <Button onClick={() => setShowForm(true)} className="primary-button">
              <Plus className="w-4 h-4 mr-2" />
              Write First Article
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BlogManagement;

