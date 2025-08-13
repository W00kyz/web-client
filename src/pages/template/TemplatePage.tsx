import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { match } from 'path-to-regexp';
import { CreateTemplate } from './crud/Create';
import { EditTemplates } from './crud/Edit';
import { ListTemplates } from './crud/List';
import { ShowTemplates } from './crud/Show';

// === Componente CRUD principal ===
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
    const isList = match(listPath, { end: true })(pathname);
    const matchCreate = match(createPath, { end: true })(pathname);
    const matchEdit = match(editPath, { end: true })(pathname);
    const matchShow = match(showPath, { end: true })(pathname);

    if (matchCreate) {
      return <CreateTemplate onCreate={handleCreate} />;
    }

    if (matchEdit && typeof matchEdit.params.id === 'string') {
      return <EditTemplates id={matchEdit.params.id} onEdit={handleEdit} />;
    }

    if (matchShow && typeof matchShow.params.id === 'string') {
      return <ShowTemplates id={matchShow.params.id} />;
    }

    if (isList) {
      return (
        <ListTemplates
          onRowClick={handleRowClick}
          onCreateClick={handleCreateClick}
          onEditClick={handleEditClick}
        />
      );
    }

    return null;
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
