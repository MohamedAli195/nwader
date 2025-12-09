import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect } from "react";
import Swal from "sweetalert2";
import Input from "../../../../components/form/input/InputField";
import Button from "../../../../components/ui/button/Button";
import { IProduct, useUpdateProductMutation } from "../../../../app/features/products/productsSlice";


interface IFormInputProduct {
  name: string;
  description: string;
  price: number;
  store_link: string;
  is_active: boolean;
  images: FileList;
}

interface IProps {
  tempProduct: IProduct | undefined;
  onCloseUp: () => void;
}

interface errorType {
  data: {
    errors?: { [key: string]: string[] };
    message?: string;
  };
  status: number;
}

export default function UpdateProductForm({ tempProduct, onCloseUp }: IProps) {
  const [updateProduct, { isLoading }] = useUpdateProductMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IFormInputProduct>();

  // Fill form with existing product data
  useEffect(() => {
    if (tempProduct) {
      setValue("name", tempProduct.name);
      setValue("description", tempProduct.description);
      setValue("price", tempProduct.price);
      setValue("store_link", tempProduct.store_link);
      setValue("is_active", tempProduct.is_active);
    }
  }, [tempProduct, setValue]);

  const onSubmit: SubmitHandler<IFormInputProduct> = async (data) => {
    const formData = new FormData();

    formData.append("id", String(tempProduct?.id));
    

    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", String(data.price));
    formData.append("store_link", data.store_link);
    formData.append("is_active", data.is_active ? "1" : "0");

    // الصور
    if (data.images && data.images.length > 0) {
      Array.from(data.images).forEach((img) => {
        formData.append("images[]", img);
      });
    }

    try {
      await updateProduct(formData).unwrap();
      Swal.fire("تم", "تم تحديث المنتج بنجاح", "success");
      onCloseUp();
    } catch (error: unknown) {
      const err = error as errorType;

      Swal.fire(
        "خطأ",
        err?.data?.errors
          ? Object.values(err.data.errors).flat().join("\n")
          : err?.data?.message || "حدث خطأ ما",
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
        <label>اسم المنتج</label>
        <Input
          type="text"
          {...register("name", { required: "الاسم مطلوب" })}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      {/* الوصف */}
      <div>
        <label>الوصف</label>
        <Input
          type="text"
          {...register("description", { required: false })}
        />
      </div>

      {/* السعر */}
      <div>
        <label>السعر</label>
        <Input
          type="number"
          step="0.01"
          {...register("price", { required: "السعر مطلوب" })}
        />
        {errors.price && (
          <p className="text-red-500 text-sm">{errors.price.message}</p>
        )}
      </div>

      {/* لينك المتجر */}
      <div>
        <label>لينك المتجر</label>
        <Input
          type="text"
          {...register("store_link", { required: "اللينك مطلوب" })}
        />
        {errors.store_link && (
          <p className="text-red-500 text-sm">{errors.store_link.message}</p>
        )}
      </div>

      {/* تفعيل المنتج */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          {...register("is_active")}
          className="w-4 h-4"
        />
        <label>فعال</label>
      </div>

      {/* صور المنتج */}
      <div>
        <label>صور المنتج</label>
        <Input type="file" multiple accept="image/*" {...register("images")} />
      </div>

      {/* زر التحديث */}
      <div>
        <Button className="w-full text-3xl" disabled={isLoading}>
          {isLoading ? "جاري التحديث..." : "تحديث المنتج"}
        </Button>
      </div>
    </form>
  );
}
