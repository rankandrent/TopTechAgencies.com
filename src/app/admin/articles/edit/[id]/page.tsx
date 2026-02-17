import ArticleForm from '@/components/admin/ArticleForm';
import prisma from '@/lib/db';
import { notFound } from 'next/navigation';

interface EditArticlePageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
    const { id } = await params;
    const article = await prisma.article.findUnique({
        where: { id },
    });

    if (!article) {
        notFound();
    }

    return (
        <div className="max-w-5xl mx-auto">
            <ArticleForm initialData={article} isEditing />
        </div>
    );
}
