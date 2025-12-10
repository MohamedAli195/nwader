import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import { errorType } from "../../../../types";
import Input from "../../../../components/form/input/InputField";
import Button from "../../../../components/ui/button/Button";
import { useCreateProductMutation } from "../../../../app/features/products/productsSlice";
import { t } from "i18next";


export interface IFormInputProduct {
  name: string;
  description: string;
  price: number;
  store_link: string;
  is_active: boolean;
  images: FileList;
}

export default function AddProduct({ onClose }: { onClose: () => void }) {
  const [createProduct, { isLoading }] = useCreateProductMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputProduct>();

  const onSubmit: SubmitHandler<IFormInputProduct> = async (data) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("description", data.description || "");
    formData.append("price", data.price.toString());
    formData.append("store_link", data.store_link);
    formData.append("is_active", data.is_active ? "1" : "0");

    // رفع عدة صور
    if (data.images && data.images.length > 0) {
      Array.from(data.images).forEach((img) => {
        formData.append("images[]", img);
      });
    }

    try {
      await createProduct(formData).unwrap();
      Swal.fire("تم", "تم إضافة المنتج بنجاح", "success");
      onClose();
    } catch (error: unknown) {
      const err = error as errorType;
      Swal.fire(
        "خطأ",
        err?.data?.errors
          ? JSON.stringify(err.data.errors)
          : "حدث خطأ غير متوقع",
        "error"
      );
    }
  };

  return (
    <form
      className="flex justify-center flex-col my-12 gap-4 p-5 w-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* الاسم */}
      <div>
        <label>{t("product Name")}</label>
        <Input
          type="text"
          {...register("name", { required: "اسم المنتج مطلوب" })}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      {/* الوصف */}
      <div>
        <label>{t("Description")}</label>
        <Input type="text" {...register("description")} />
      </div>

      {/* السعر */}
      <div>
        <label>{t("Price")}</label>
        <Input
          type="number"
          step="0.01"
          {...register("price", { required: "السعر مطلوب" })}
        />
        {errors.price && (
          <p className="text-red-500 text-sm">{errors.price.message}</p>
        )}
      </div>

      {/* رابط المتجر */}
      <div>
        <label>{t("Product Link")}</label>
        <Input
          type="text"
          {...register("store_link", { required: "رابط المتجر مطلوب" })}
        />
        {errors.store_link && (
          <p className="text-red-500 text-sm">{errors.store_link.message}</p>
        )}
      </div>

      {/* الحالة */}
      <div className="flex items-center gap-2">
        <label>{t("status")}</label>
        <input type="checkbox" {...register("is_active")} />
      </div>

      {/* الصور */}
      <div>
        <label>{t("Image")}</label>
        <Input
          type="file"
          accept="image/*"
          multiple
          {...register("images")}
        />
      </div>

      <div>
        <Button className="w-full text-3xl" disabled={isLoading}>
          {isLoading ? "جاري الإضافة..." : t("addButton")}
        </Button>
      </div>
    </form>
  );
}
