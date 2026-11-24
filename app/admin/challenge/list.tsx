import {
  Datagrid,
  List,
  TextField,
  ReferenceField,
  NumberField,
  SelectField,
} from "react-admin";

export const ChallengeList = () => {
  return (
    <List sort={{ field: "order", order: "ASC" }}>
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <TextField source="question" />
        <SelectField
          source="type"
          choices={[
            { id: "SELECT", name: "SELECT" },
            { id: "ASSIST", name: "ASSIST" },
          ]}
        />
        <ReferenceField source="lessonId" reference="lessons" />
        <NumberField source="order" />
      </Datagrid>
    </List>
  );
};