import { useState } from "react";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import CategoryForm from "../../components/CategoryForm";
import Modal from "../../components/Modal";


const CategoryList = () => {
  const { data: categories } = useFetchCategoriesQuery();
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }
    try {
      const result = await createCategory({ name }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        setName("");
        toast.success(`${result.name} created successfully.`);
      }
    } catch {
      toast.error("Creating category failed, please try again.");
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!updatingName.trim()) {
      toast.error("Category name is required");
      return;
    }
    try {
      const result = await updateCategory({
        categoryId: selectedCategory._id,
        updatedCategory: { name: updatingName },
      }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} updated successfully.`);
        setSelectedCategory(null);
        setUpdatingName("");
        setModalVisible(false);
      }
    } catch {
      toast.error("Updating category failed, please try again.");
    }
  };

  const handleDeleteCategory = async () => {
    try {
      const result = await deleteCategory(selectedCategory._id).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} deleted successfully.`);
        setSelectedCategory(null);
        setModalVisible(false);
      }
    } catch {
      toast.error("Deleting category failed, please try again.");
    }
  };

  return (
    <div className="ml-0 md:ml-[10rem] flex flex-col md:flex-row min-h-screen gap-6 md:gap-8 p-6 md:p-8 bg-gradient-to-br from-[#FAF7F6] to-[#E3DED7] rounded-3xl shadow-xl">
      

      <main className="md:w-3/4 bg-white rounded-tl-3xl shadow-lg p-6 md:p-10 flex flex-col min-h-[calc(100vh-48px)]">
        <h2 className="text-[#285570] text-3xl md:text-4xl font-extrabold mb-6 md:mb-8">
          Manage Categories
        </h2>

        <CategoryForm
          value={name}
          setValue={setName}
          handleSubmit={handleCreateCategory}
          buttonText="Create Category"
          inputClassName="border border-[#3CBEAC] rounded-lg focus:ring-2 focus:ring-[#285570] focus:outline-none px-4 py-3 w-full max-w-md transition text-[#285570]"
          buttonClassName="bg-gradient-to-r from-[#EFAF76] to-[#FFC978] hover:from-[#3CBEAC] hover:to-[#1D8C83] text-[#285570] font-semibold px-6 py-3 rounded-lg shadow-lg transition transform hover:scale-105"
        />

        <hr className="my-6 md:my-8 border-[#E3DED7]" />

        <div className="flex flex-wrap gap-4 md:gap-5">
          {categories?.map((category) => (
            <button
              key={category._id}
              onClick={() => {
                setModalVisible(true);
                setSelectedCategory(category);
                setUpdatingName(category.name);
              }}
              className="flex items-center justify-center bg-white border border-[#3CBEAC] text-[#3CBEAC] py-3 px-5 md:px-7 rounded-lg shadow hover:bg-gradient-to-r hover:from-[#3CBEAC] hover:to-[#1D8C83] hover:text-white transition transform hover:scale-105 font-semibold cursor-pointer"
            >
              {category.name}
            </button>
          ))}
        </div>

        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
          <CategoryForm
            value={updatingName}
            setValue={setUpdatingName}
            handleSubmit={handleUpdateCategory}
            buttonText="Update"
            handleDelete={handleDeleteCategory}
            inputClassName="border border-[#285570] rounded-lg focus:ring-2 focus:ring-[#3CBEAC] focus:outline-none px-4 py-3 w-full max-w-md transition text-[#285570]"
            buttonClassName="bg-gradient-to-r from-[#285570] to-[#3CBEAC] hover:from-[#3CBEAC] hover:to-[#285570] text-white px-6 py-3 rounded-lg shadow-lg transition transform hover:scale-105"
            deleteButtonClassName="mt-4 w-full bg-[#FF6B6B] hover:bg-[#E63946] text-white px-6 py-3 rounded-lg transition"
          />
        </Modal>
      </main>
    </div>
  );
};

export default CategoryList;
