import {
  Datagrid,
  List,
  TextField,
  ReferenceField,
  NumberField,
} from "react-admin";

export const LessonList = () => {
  return (
    <List sort={{ field: "order", order: "ASC" }}>
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <TextField source="title" />
        <ReferenceField source="unitId" reference="units" />
        <NumberField source="order" />
      </Datagrid>
    </List>
  );
};