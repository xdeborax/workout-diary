import Articles from '../components/Articles';

export default function ArticlePage() {
  return (
    <main className="container pb-5">
      <Articles showOnlySixArticles={false} />
    </main>
  );
}
