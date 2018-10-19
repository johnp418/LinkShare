import * as React from "react";
// import { Link } from "react-router-dom";
// import styled from "styled-components";
import { Formik, Field, ErrorMessage, Form } from "formik";
import axios from "axios";
import * as Yup from "yup";
// import { Auth } from "aws-amplify";
// import { withAuthenticator, Authenticator } from "aws-amplify-react"; // or 'aws-amplify-react-native';

import {
  Section,
  SectionContainer,
  SectionContentContainer,
  SectionHeader
} from "../components/Section";
import { History } from "history";

const createRepoValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(4)
    .max(256)
    .required("This field is required"),
  isPrivate: Yup.boolean()
});

// const checkAuth = async () => {
//   return await Auth.currentUserInfo();
// };
interface Props {
  history: History;
}

class CreateRepository extends React.Component<Props> {
  state = {
    loading: false
  };

  render() {
    console.log("CreateRepo Props ", this.props);

    return (
      <Section>
        <SectionContainer>
          <SectionHeader>Create your repository</SectionHeader>
          <SectionContentContainer>
            <Formik
              initialValues={{ name: "", isPrivate: false }}
              onSubmit={(values, actions) => {
                // TODO: redirect user after creating
                console.log("Hello submit ", values, " actions ", actions);
                this.setState({ loading: true });
                axios
                  .post("/repo", {
                    title: values.name,
                    userId: "John Park"
                  })
                  .then(response => {
                    console.log("Response ", response);
                    this.props.history.push(`/list/${response.data.id}`);
                  })
                  .catch(err => {
                    console.log("Error post ", err);
                    this.setState({ loading: false, error: err });
                  });
              }}
              validationSchema={createRepoValidationSchema}
              render={formikProps => {
                console.log("formikProps ", formikProps);
                // const {
                //   values: { isPrivate }
                // } = formikProps;
                return (
                  <Form>
                    <Field
                      type="text"
                      name="name"
                      placeholder="Repository name"
                    />
                    <ErrorMessage name="name" />
                    <Field type="checkbox" name="isPrivate" />
                    <button type="submit"> create </button>
                  </Form>
                );
              }}
            />
          </SectionContentContainer>
        </SectionContainer>
      </Section>
    );
  }
}

export default CreateRepository;
