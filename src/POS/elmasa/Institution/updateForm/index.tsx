import { useEffect } from "react";
// import Input from "../../../../components/form/input/InputField";
import {
  Booking,
  useUpdateAcademicBookingsMutation,
} from "../../../../app/features/academicBooking/academicBookingApi";
import { CreateBookingRequest } from "../addForm";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Select from "react-select";
import Swal from "sweetalert2";
import Button from "../../../../components/ui/button/Button";
import { useGetAcademicStudentsQuery } from "../../../../app/features/academicStudent/academicStudentApi";
import { useGetAcademicClassesQuery } from "../../../../app/features/academicClasses/academicClassesSlice";
import { useState } from "react";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import { useGetTeatchersQuery } from "../../../../app/features/teachers/teachersSlice";
export interface IFormInputEduSys {
  name: string;
  phone: string;
  // password: string;
}

interface IProps {
  tempCat: Booking | undefined;
  onCloseUp: () => void;
}
interface errorType {
  data: {
    errors: {
      name: string[];
      message: string;
    };
  };
  status: number;
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
export default function UpdateacademicBookingForm({
  tempCat,
  onCloseUp,
}: IProps) {
  console.log(tempCat);
  const [BookingDate, setBookingDate] = useState<Date | null>(null);
  // const DateForBooking = BookingDate ? format(BookingDate, "yyyy-MM-dd") : "";
  // const [confirmedStatus, setConfirmedStatus] = useState<string | null>(
  //   "confirmed"
  // );
  //fetch Students
  const { data: studentDAta, isLoading: StudentLoad } =
    useGetAcademicStudentsQuery({
      search: "",
      page: 1,
    });
  const Students = studentDAta?.data ?? [];
  console.log(Students);
  const eduSysOptions: Option[] =
    Students.map((Student) => ({
      value: Student.id || 1,
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
      value: classe.id || 1,
      label: classe.name,
    })) || [];
  const [updateAcademicBookings, { isLoading }] =
    useUpdateAcademicBookingsMutation();

  const { handleSubmit, setValue, control } = useForm<CreateBookingRequest>({
    defaultValues: {
      status: "confirmed",
    },
  });

  // Effect to populate form values if tempCat is available
  // في useEffect
  useEffect(() => {
    if (tempCat) {
      setValue("student_id", tempCat.student.id);
      setValue("teacher_id", tempCat.teacher.id);
      setValue("class_id", tempCat.class_details.id);
      setValue("booking_time", tempCat.booking_time);
      setValue("status", tempCat.status);

      setBookingDate(new Date(tempCat.booking_time));

      // setValue("password", tempCat.password ?? "");
    }
  }, [tempCat, setValue]);

  // Form submission handler
  const onSubmit: SubmitHandler<CreateBookingRequest> = async (data) => {
    if (!tempCat?.id) {
      Swal.fire("خطأ", "لا يوجد معرف صالح للحجز المراد تعديله", "error");
      return;
    }

    if (!BookingDate) {
      Swal.fire("خطأ", "يرجى اختيار تاريخ الحجز", "error");
      return;
    }

    try {
      await updateAcademicBookings({
        id: Number(tempCat?.id ?? tempCat?.booking_id),
        body: {
          student_id: data.student_id,
          teacher_id: data.teacher_id,
          class_id: data.class_id,
          booking_time: format(BookingDate, "yyyy-MM-dd HH:mm:ss"),
          status: data.status,
        },
      }).unwrap();

      Swal.fire("تم", "تم التحديث بنجاح", "success");
      onCloseUp();
    } catch (error: unknown) {
      const err = error as errorType;

      Swal.fire(
        "خطأ",
        err?.data?.errors?.name
          ? err.data.errors.name.join("\n")
          : "حدث خطأ أثناء التحديث",
        "error"
      );
    }
  };

  return (
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
              value={teatchersOptions.find(
                (opt) => Number(opt.value) === Number(field.value)
              )}
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
          {isLoading ? "انتظر..." : "تعديل"}
        </Button>
      </div>

      {/* Error and success handling */}
      {/* {isError && <p style={{ color: "red" }}>Error: {error?.message}</p>} */}
      {/* {data && <p style={{ color: "green" }}>Student added successfully!</p>} */}
    </form>
  );
}
