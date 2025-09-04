import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { match } from 'path-to-regexp';
import { Create } from './crud';

export const Crud = ({ rootPath }: { rootPath: string }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const listPath = rootPath;
  const createPath = `${rootPath}/new`;
  const editPath = `${rootPath}/:id/edit`;
  const showPath = `${rootPath}/:id`;

  const handleRowClick = useCallback(
    (id: string | number) => {
      navigate(`${rootPath}/${id}`);
    },
    [navigate, rootPath]
  );

  const handleCreateClick = useCallback(() => {
    navigate(createPath);
  }, [navigate, createPath]);

  const handleCreate = useCallback(() => {
    navigate(listPath);
  }, [navigate, listPath]);

  const handleEditClick = useCallback(
    (id: string | number) => {
      navigate(`${rootPath}/${id}/edit`);
    },
    [navigate, rootPath]
  );

  const handleEdit = useCallback(() => {
    navigate(listPath);
  }, [navigate, listPath]);

  const renderedRoute = useMemo(() => {
    return <Create></Create>
  }, [
    pathname,
    listPath,
    createPath,
    editPath,
    showPath,
    handleRowClick,
    handleCreateClick,
    handleCreate,
    handleEdit,
  ]);

  return <>{renderedRoute}</>;
};

export const TemplatePage = () => {
  return <Crud rootPath="/templates" />;
};
