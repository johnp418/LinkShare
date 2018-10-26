import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { AppState, APIProps } from "src/types";
import { Formik, FormikProps, Form, Field, FieldProps } from "formik";
import * as Yup from "yup";
import {
  createLoadingSelector,
  createErrorMessageSelector
} from "src/reducers/selectors";
import { RouteComponentProps } from "react-router-dom";
import { Auth } from "aws-amplify";
// import { Redirect } from "react-router-dom";
// import { Formik, FormikProps, Form, Field, FieldProps } from "formik";

// import { StoreState } from '../types';
// import { bindActionCreators, Dispatch } from 'redux';
// import { login } from '../actions/auth';
// import { Button } from '../components/Button';

interface SignUpFormValues {
  email: string;
  password: string;
}

// interface Props {

// }

interface DispatchProps {
  signUp: Function;
}

const signUpValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Enter a valid email address")
    .required(),
  password: Yup.string()
});

class SignUp extends React.Component<DispatchProps & APIProps> {
  render() {
    // const {
    //   auth: { currentUser, loading, error }
    // } = this.props;
    const { loading, error, signUp } = this.props;

    // // User is already signed in, redirect to Dashboard
    // if (currentUser) {
    //   return <Redirect to="/" />;
    // }
    const Loading = () => {
      return <div>Loading...</div>;
    };

    if (loading) {
      return <Loading />;
    }
    if (error) {
      return <div>Error: {error}</div>;
    }

    return (
      <div>
        <h1>Login Form</h1>
        <Formik
          initialValues={{
            email: "",
            password: "",
            passwordConfirm: ""
          }}
          onSubmit={(values: SignUpFormValues) => {
            const { email, password } = values;
            console.log("Login Submit");
            // signUp({ email, password });
            Auth.signUp({
              username: email,
              password
            })
              .then(data => {
                console.log("User Sign up data ", data);
              })
              .catch(err => {
                console.log("User sign up error ", err);
              });
          }}
          validationSchema={signUpValidationSchema}
          render={(formikBag: FormikProps<SignUpFormValues>) => {
            return (
              <Form>
                <Field
                  name="email"
                  render={(formikProps: FieldProps<SignUpFormValues>) => {
                    const { field, form } = formikProps;
                    return (
                      <div>
                        <label htmlFor="">Email</label>
                        <input type="text" {...field} placeholder="Email" />
                        {form.touched.email &&
                          form.errors.email &&
                          form.errors.email}
                      </div>
                    );
                  }}
                />
                <Field
                  name="password"
                  render={({ field, form }: FieldProps<SignUpFormValues>) => {
                    return (
                      <div>
                        <label htmlFor="">Password</label>
                        <input
                          type="password"
                          {...field}
                          placeholder="Password"
                        />
                        {form.touched.password &&
                          form.errors.password &&
                          form.errors.password}
                      </div>
                    );
                  }}
                />

                <button type="submit">Sign Up</button>
              </Form>
            );
          }}
        />
      </div>
    );
  }
}

const loadingSelector = createLoadingSelector(["SIGN_UP_REQUST"]);
const errorSelector = createErrorMessageSelector(["SIGN_UP_FAILURE"]);
const mapStateToProps = (state: AppState) => {
  return {
    loading: loadingSelector(state),
    error: errorSelector(state)
  };
};

const signUp = ({ email, password }: SignUpFormValues) => {
  console.log("Email ", email, " Password ", password);
  //   Auth.signUp({
  //     username,
  //     password,
  //     attributes: {
  //         email,          // optional
  //         phone_number,   // optional - E.164 number convention
  //         // other custom attributes
  //     },
  //     validationData: []  //optional
  //     })
  //     .then(data => console.log(data))
  //     .catch(err => console.log(err));

  // // After retrieveing the confirmation code from the user
  // Auth.confirmSignUp(username, code, {
  //     // Optional. Force user confirmation irrespective of existing alias. By default set to True.
  //     forceAliasCreation: true
  // }).then(data => console.log(data))
  //   .catch(err => console.log(err));
  // Auth.signUp({
  //   username: email,
  //   password
  // })
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({ signUp }, dispatch);
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUp);
