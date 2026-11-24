
import {
  Datagrid,
  List,
  TextField,
  ReferenceField,
  NumberField,
  BooleanField,
} from "react-admin";

export const ChallengeOptionList = () => {
  return (
    <List
      sort={{ field: "challengeId", order: "ASC" }}
      perPage={100}
    >
      <Datagrid rowClick="edit">
        <NumberField source="id" />

        <ReferenceField source="challengeId" reference="challenges">
          <NumberField source="id" />
        </ReferenceField>

        <ReferenceField source="challengeId" reference="challenges">
          <TextField source="question" />
        </ReferenceField>

        <TextField source="text" />
        <BooleanField source="correct" />
        <TextField source="imageSrc" />
        <TextField source="audioSrc" />
        <TextField source="videoSrc" />
      </Datagrid>
    </List>
  );
};
