
import React from 'react';
import BlogForm from './BlogForm';
import { AdminLayout } from '@/components/admin/AdminLayout';

const NewBlog = () => {
  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Create New Blog Post</h1>
        <BlogForm />
      </div>
    </AdminLayout>
  );
};

export default NewBlog;
