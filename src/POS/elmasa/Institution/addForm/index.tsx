import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Select from "react-select";
import Swal from "sweetalert2";
import { errorType } from "../../../../types";
import Button from "../../../../components/ui/button/Button";
import { useGetAcademicStudentsQuery } from "../../../../app/features/academicStudent/academicStudentApi";
import { useCreateAcademicBookingsMutation } from "../../../../app/features/academicBooking/academicBookingApi";
import { useGetAcademicClassesQuery } from "../../../../app/features/academicClasses/academicClassesSlice";
import { useState } from "react";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import { useGetTeatchersQuery } from "../../../../app/features/teachers/teachersSlice";

export interface CreateBookingRequest {
  student_id: number;
  teacher_id: number;
  class_id: number;
  booking_time: string; // format: "YYYY-MM-DD HH:mm:ss"
  status: string; // optionally narrow the type if you know possible statuses
}
type Option = {
  label: string;
  value: string | number;
};
const confirmedOptions: Option[] = [
  { value: "confirmed", label: "confirmed" },
  { value: "pending", label: "pending" },
  { value: "cancelled", label: "cancelled" },
];
export default function AddAcademicBooking({
  onClose,
}: {
  onClose: () => void;
}) {
  // const [eduSysData, setEduSysData] = useState<IEduSystems | null>(null);
  //state

  const [BookingDate, setBookingDate] = useState<Date | null>(null);
  // const DateForBooking = BookingDate ? format(BookingDate, "yyyy-MM-dd") : "";
  // const [confirmedStatus, setConfirmedStatus] = useState<string | null>(
  //   "confirmed"
  // );
  //fetch suppliers
  const { data: studentDAta, isLoading: StudentLoad } =
    useGetAcademicStudentsQuery({
      search: "",
      page: 1,
    });
  const Students = studentDAta?.data ?? [];
  const eduSysOptions: Option[] =
    Students.map((Student) => ({
      value: Student.id?.toString() || "",
      label: Student.name,
    })) || [];

  //fetch teatchers
  const { data: teatchersDAta, isLoading: teatchersLoad } =
    useGetTeatchersQuery({
      search: "",
      page: 1,
    });
  const teatchers = teatchersDAta?.data ?? [];
  const teatchersOptions: Option[] =
    teatchers.map((teatcher) => ({
      value: teatcher.id?.toString() || "",
      label: teatcher.name,
    })) || [];

  //fetch Classes
  const { data: ClassesData, isLoading: ClassesLoad } =
    useGetAcademicClassesQuery({
      search: "",
      page: 1,
    });
  const classes = ClassesData?.data ?? [];
  const classesOptions: Option[] =
    classes.map((classe) => ({
      value: classe.id?.toString() || "",
      label: classe.name,
    })) || [];

  const [createAcademicBookings, { data, isLoading }] =
    useCreateAcademicBookingsMutation();

  const {
    // register,
    handleSubmit,
    control,
    // formState: { errors },
  } = useForm<CreateBookingRequest>({
    defaultValues: {
      status: "confirmed",
    },
  });

  const onSubmit: SubmitHandler<CreateBookingRequest> = async (data) => {
    // Prepare FormData to send as a POST request
    if (!BookingDate) {
      Swal.fire("خطأ", "يرجى اختيار تاريخ الحجز", "error");
      return;
    }
    const formData = new FormData();
    formData.append("student_id", String(data.student_id));
    formData.append("teacher_id", String(data.teacher_id));
    formData.append("class_id", String(data.class_id));
    formData.append("booking_time", format(BookingDate, "yyyy-MM-dd HH:mm:ss"));
    formData.append("status", data.status);
    console.log(formData);

    try {
      await createAcademicBookings(formData).unwrap(); // This will throw if there's an error
      Swal.fire("تم ", "تم بنجاح", "success");
    } catch (error: unknown) {
      const err = error as errorType;

      Swal.fire(
        "Error",
        err?.data?.errors?.name
          ? err.data.errors.name.join("\n")
          : "Something went wrong",
        "error"
      );
    }
    onClose();
  };

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form
      className="flex justify-center  flex-col my-12 gap-2 p-5 w-full "
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Name inputs for different languages */}

      <div className="flex items-center gap-1">
        <label className="block mb-1">الطالب</label>
        <Controller
          control={control}
          name="student_id"
          render={({ field }) => (
            <Select<Option, false>
              {...field}
              options={eduSysOptions}
              isClearable
              className="w-auto"
              isLoading={StudentLoad}
              placeholder="اسم الطالب"
              onChange={(val) => {
                field.onChange(val?.value ?? null);
              }}
              value={eduSysOptions.find((opt) => opt.value === field.value)}
            />
          )}
        />
      </div>

      <div className="flex items-center gap-1">
        <label className="block mb-1">المعلم</label>
        <Controller
          control={control}
          name="teacher_id"
          render={({ field }) => (
            <Select<Option, false>
              {...field}
              options={teatchersOptions}
              isClearable
              className="w-auto"
              isLoading={teatchersLoad}
              placeholder="اسم المعلم"
              onChange={(val) => {
                field.onChange(val?.value ?? null);
              }}
              value={teatchersOptions.find((opt) => opt.value === field.value)}
            />
          )}
        />
      </div>

      <div className="flex items-center gap-1">
        <label className="block mb-1">الماده</label>
        <Controller
          control={control}
          name="class_id"
          render={({ field }) => (
            <Select<Option, false>
              {...field}
              options={classesOptions}
              isClearable
              className="w-auto"
              isLoading={ClassesLoad}
              placeholder="اسم المادة"
              onChange={(val) => {
                field.onChange(val?.value ?? null);
              }}
              value={classesOptions.find((opt) => opt.value === field.value)}
            />
          )}
        />
      </div>

      <div className="flex items-center gap-2">
        <label className="whitespace-nowrap">تاريخ الحجز</label>
        <DatePicker
          selected={BookingDate}
          onChange={(date) => setBookingDate(date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="اختر التاريخ "
          className="border px-2 py-1 rounded-md"
          isClearable
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          timeCaption="الوقت"
        />
      </div>
      <div className="flex items-center gap-1">
        <label className="block mb-1">حالة الحجز</label>
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Select<Option, false>
              {...field}
              options={confirmedOptions}
              isClearable
              className="w-auto"
              placeholder="حالة الحجز"
              onChange={(val) => field.onChange(val?.value ?? null)}
              value={confirmedOptions.find((opt) => opt.value === field.value)}
            />
          )}
        />
      </div>
      {/* Submit button */}
      <div>
        <Button className="w-full text-3xl" disabled={isLoading}>
          {isLoading ? "انتظر..." : " اضافة طالب"}
        </Button>
      </div>

      {/* Error and success handling */}
      {/* {isError && <p style={{ color: "red" }}>Error: {error?.message}</p>} */}
      {data && <p style={{ color: "green" }}>Student added successfully!</p>}
    </form>
  );
}
