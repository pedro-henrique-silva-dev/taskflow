import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router';
import CategoryForm from '../components/categories/CategoryForm.jsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Icon from '../components/ui/Icon.jsx';
import Loader from '../components/ui/Loader.jsx';
import Modal from '../components/ui/Modal.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import { useTasks } from '../hooks/useTasks.js';
import { useToast } from '../hooks/useToast.js';

function CategoriesPage() {
  const { tasks, categories, isLoading, createCategory, updateCategory, deleteCategory } =
    useTasks();
  const toast = useToast();
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const taskCountByCategory = useMemo(() => {
    const counts = new Map();
    tasks.forEach((task) => {
      if (task.categoryId) counts.set(task.categoryId, (counts.get(task.categoryId) ?? 0) + 1);
    });
    return counts;
  }, [tasks]);

  const closeEdit = useCallback(() => setCategoryToEdit(null), []);
  const closeDelete = useCallback(() => setCategoryToDelete(null), []);

  const handleCreate = async (values) => {
    try {
      const category = await createCategory(values);
      toast.success('Categoria criada com sucesso.');
      return category;
    } catch (error) {
      toast.error(error.message || 'Não foi possível criar a categoria.');
      return null;
    }
  };

  const handleUpdate = async (values) => {
    try {
      const category = await updateCategory(categoryToEdit.id, values);
      toast.success('Categoria atualizada com sucesso.');
      closeEdit();
      return category;
    } catch (error) {
      toast.error(error.message || 'Não foi possível atualizar a categoria.');
      return null;
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteCategory(categoryToDelete.id);
      toast.success('Categoria excluída.');
      closeDelete();
    } catch (error) {
      toast.error(error.message || 'Não foi possível excluir a categoria.');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatCount = (count) => (count === 1 ? '1 tarefa' : `${count} tarefas`);

  return (
    <>
      <PageHeader title="Categorias" description="Agrupe suas tarefas por contexto." />

      <div className="categories">
        <section className="card">
          <h2 className="card__title">Nova categoria</h2>
          <CategoryForm categories={categories} onSubmit={handleCreate} idPrefix="new-category" />
        </section>

        <section className="card">
          <h2 className="card__title">Suas categorias</h2>
          {isLoading ? (
            <Loader label="Carregando categorias..." />
          ) : categories.length === 0 ? (
            <EmptyState
              icon="tag"
              title="Nenhuma categoria"
              description="Crie categorias para organizar suas tarefas."
            />
          ) : (
            <ul className="category-list">
              {categories.map((category) => {
                const count = taskCountByCategory.get(category.id) ?? 0;
                return (
                  <li key={category.id} className="category-list__item">
                    <span
                      className="category-list__color"
                      style={{ backgroundColor: category.color }}
                      aria-hidden="true"
                    />
                    <span className="category-list__info">
                      <span className="category-list__name">{category.name}</span>
                      <Link
                        to={`/tarefas?category=${category.id}`}
                        className="category-list__count"
                      >
                        {formatCount(count)}
                      </Link>
                    </span>
                    <button
                      type="button"
                      className="icon-btn"
                      onClick={() => setCategoryToEdit(category)}
                      aria-label={`Editar categoria ${category.name}`}
                      title="Editar"
                    >
                      <Icon name="edit" size={18} />
                    </button>
                    <button
                      type="button"
                      className="icon-btn icon-btn--danger"
                      onClick={() => setCategoryToDelete(category)}
                      aria-label={`Excluir categoria ${category.name}`}
                      title="Excluir"
                    >
                      <Icon name="trash" size={18} />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      <Modal title="Editar categoria" isOpen={Boolean(categoryToEdit)} onClose={closeEdit} size="sm">
        <CategoryForm
          key={categoryToEdit?.id}
          category={categoryToEdit}
          categories={categories}
          onSubmit={handleUpdate}
          onCancel={closeEdit}
          idPrefix="edit-category"
        />
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(categoryToDelete)}
        title="Excluir categoria"
        message={`Excluir a categoria "${categoryToDelete?.name}"? As tarefas dessa categoria não serão excluídas e ficarão sem categoria.`}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={closeDelete}
      />
    </>
  );
}

export default CategoriesPage;
