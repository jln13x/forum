import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Flex,
  Link,
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import router from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { toErrorMap } from "../utils/toErrorMap";
import login from "./login";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useForgotPasswordMutation } from "../generated/graphql";
import { useState } from "react";

export const ForgotPassword: React.FC<{}> = ({}) => {
  const [complete, setComplete] = useState(false);
  const [, forgotPassword] = useForgotPasswordMutation();

  const initialValues = {
    email: "",
  };
  return (
    <Wrapper>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values, { setErrors }) => {
          await forgotPassword(values);
          setComplete(true);
        }}
      >
        {({ isSubmitting }) =>
          complete ? (
            <Alert status="success" rounded="base" mb={4} bgColor="green.900">
              <AlertIcon />
              <AlertTitle mr={2}>Forgot password!</AlertTitle>
              <AlertDescription>An email has been sent!</AlertDescription>
            </Alert>
          ) : (
            <Form>
              <InputField
                name="email"
                placeholder="Enter email..."
                label="Email"
                type="email"
              />
              <Button
                type="submit"
                colorScheme="teal"
                mt={3}
                isLoading={isSubmitting}
              >
                Forgot password
              </Button>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
