import { useRouteError } from 'react-router-dom';
import { ContentPage } from '../scenes/content-page';
import { NotFoundPage } from './notFound';

export let RouterErrorPage = () => {
  let error = useRouteError();

  if ((error as any)?.status === 404) return <NotFoundPage />;

  return (
    <ContentPage
      title="An error occurred"
      description={`An error occurred while trying to render this page: ${
        (error as any).message ?? 'unknown error'
      }`}
    />
  );
};
