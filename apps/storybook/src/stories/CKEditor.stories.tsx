import { CKEditor } from '@repo/editor';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { CustomDocsPage } from '../components/CustomDocsPage';

const meta = {
  title: 'Components/CKEditor',
  component: CKEditor,
  parameters: {
    layout: 'padded',
    docs: {
      page: () => (
        <CustomDocsPage
          componentName="CKEditor"
          description="강력한 WYSIWYG 에디터 컴포넌트입니다. 텍스트 포맷팅, 이미지 업로드, 테이블, 링크 등 다양한 기능을 지원합니다."
          installationDeps={['@ckeditor/ckeditor5-react', '@repo/editor']}
          implementationCode={`// 기본 CKEditor 컴포넌트 사용
import { CKEditor } from "@repo/editor";
import { useState } from "react";

export default function Example() {
  const [content, setContent] = useState("");

  return (
    <div className="w-full">
      <CKEditor 
        data={content}
        onEditorChange={(data) => setContent(data)}
        placeholder="내용을 입력하세요..."
      />
      
      {/* 작성된 내용 미리보기 */}
      <div 
        className="mt-4 p-4 border rounded" 
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}`}
          exampleCode={`// 실제 사용 예시 - 게시글 작성 폼
function ArticleForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await saveArticle({ title, content });
      toast.success("게시글이 저장되었습니다.");
    } catch (error) {
      toast.error("저장에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          제목
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          placeholder="제목을 입력하세요"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">
          내용
        </label>
        <CKEditor 
          data={content}
          onEditorChange={setContent}
          placeholder="내용을 입력하세요..."
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button">
          취소
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "저장 중..." : "저장"}
        </Button>
      </div>
    </form>
  );
}`}
        />
      ),
    },
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      control: 'text',
      description: '에디터에 표시될 초기 HTML 콘텐츠',
    },
    placeholder: {
      control: 'text',
      description: '에디터가 비어있을 때 표시될 플레이스홀더 텍스트',
    },
  },
} satisfies Meta<typeof CKEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 에디터
const DefaultComponent = () => {
  const [content, setContent] = useState('');

  return (
    <div className="w-full max-w-4xl">
      <CKEditor data={content} onEditorChange={setContent} placeholder="내용을 입력하세요..." />
    </div>
  );
};

export const Default: Story = {
  render: () => <DefaultComponent />,
  args: {
    onEditorChange: () => {},
  },
};

// 초기 콘텐츠가 있는 에디터
const WithInitialContentComponent = () => {
  const [content, setContent] = useState(`
      <h2>CKEditor를 사용한 콘텐츠 편집</h2>
      <p>이것은 <strong>강력한</strong> <em>WYSIWYG</em> 에디터입니다.</p>
      <ul>
        <li>텍스트 포맷팅</li>
        <li>이미지 업로드</li>
        <li>테이블 삽입</li>
        <li>링크 추가</li>
      </ul>
      <p>다양한 기능을 제공합니다!</p>
    `);

  return (
    <div className="w-full max-w-4xl">
      <CKEditor data={content} onEditorChange={setContent} placeholder="내용을 입력하세요..." />
    </div>
  );
};

export const WithInitialContent: Story = {
  render: () => <WithInitialContentComponent />,
  args: {
    onEditorChange: () => {},
  },
};

// 콘텐츠 미리보기와 함께
const WithPreviewComponent = () => {
  const [content, setContent] = useState('<p>여기에 내용을 입력하면 아래에서 미리보기를 확인할 수 있습니다.</p>');

  return (
    <div className="w-full max-w-4xl space-y-6">
      <div>
        <h3 className="mb-3 text-lg font-semibold">에디터</h3>
        <CKEditor data={content} onEditorChange={setContent} placeholder="내용을 입력하세요..." />
      </div>

      <div>
        <h3 className="mb-3 text-lg font-semibold">미리보기</h3>
        <div className="rounded-lg border bg-gray-50 p-6 dark:bg-gray-900">
          <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>
    </div>
  );
};

export const WithPreview: Story = {
  render: () => <WithPreviewComponent />,
  args: {
    onEditorChange: () => {},
  },
};

// 커스텀 플레이스홀더
const WithCustomPlaceholderComponent = () => {
  const [content, setContent] = useState('');

  return (
    <div className="w-full max-w-4xl">
      <CKEditor data={content} onEditorChange={setContent} placeholder="여기에 멋진 콘텐츠를 작성해보세요! ✨" />
    </div>
  );
};

export const WithCustomPlaceholder: Story = {
  render: () => <WithCustomPlaceholderComponent />,
  args: {
    onEditorChange: () => {},
  },
};

// 게시글 작성 폼 예시
const ArticleFormComponent = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted:', { title, content, category });
    alert('게시글이 제출되었습니다! (콘솔 확인)');
  };

  return (
    <div className="bg-card w-full max-w-4xl rounded-lg border p-6 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold">게시글 작성</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium">제목</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="border-input ring-offset-background focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-2"
            placeholder="게시글 제목을 입력하세요"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">카테고리</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="border-input ring-offset-background focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-2"
          >
            <option value="general">일반</option>
            <option value="notice">공지사항</option>
            <option value="faq">FAQ</option>
            <option value="news">뉴스</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">내용</label>
          <div className="editor">
            <CKEditor data={content} onEditorChange={setContent} placeholder="게시글 내용을 작성하세요22..." />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            className="rounded-md border border-gray-300 bg-transparent px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            취소
          </button>
          <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700" disabled={!title || !content}>
            게시글 등록
          </button>
        </div>
      </form>
    </div>
  );
};

export const ArticleForm: Story = {
  render: () => <ArticleFormComponent />,
  args: {
    onEditorChange: () => {},
  },
};
