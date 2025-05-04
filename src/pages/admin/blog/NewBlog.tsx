
import { AdminLayout } from '@/components/admin/AdminLayout';
import BlogForm from '@/components/admin/blog/BlogForm';

const NewBlog = () => {
  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Nouvel Article</h1>
          <p className="text-muted-foreground">Créer un nouvel article de blog</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <BlogForm />
        </div>
      </div>
    </AdminLayout>
  );
};

export default NewBlog;
