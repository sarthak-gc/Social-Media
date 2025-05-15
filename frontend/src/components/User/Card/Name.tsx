interface NameProp {
  firstName: string;
  lastName: string;
  email: string;
  middleName?: string;
}
const Name = ({ firstName, lastName, email, middleName }: NameProp) => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-semibold">
          {firstName} {middleName} {lastName}
        </h2>
        <p className="text-gray-600">{email}</p>
      </div>
    </div>
  );
};

export default Name;
