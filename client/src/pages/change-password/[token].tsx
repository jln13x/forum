import { Alert, AlertIcon, Box, Button, Flex, Link } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { pid } from "process";
import React from "react";
import { useState } from "react";
import { InputField } from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";
import { useChangePasswordMutation } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { toErrorMap } from "../../utils/toErrorMap";
import NextLink from "next/link";

const ChangePassword: NextPage = () => {
  const router = useRouter();
  const [, changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState("");

  const initialValues = {
    newPassword: "",
  };
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={initialValues}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            newPassword: values.newPassword,
            token:
              typeof router.query.token === "string" ? router.query.token : "",
          });

          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors);

            // Can't use setErrors because token is not an initialValue
            // Workaround: Hidden Inputfield or like I did now: setState
            if ("token" in errorMap) {
              setTokenError(errorMap.token);
            }
            setErrors(errorMap);
          } else if (response.data?.changePassword.user) {
            router.push("/");
          }
        }}
      >
        {/* render props */}
        {({ isSubmitting }) => (
          <Form>
            {tokenError ? (
              <Box>
                <Alert status="error" rounded="base" mb={4} bgColor="red.900">
                  <AlertIcon />
                  <Flex justifyContent="space-between" width="100%">
                    {tokenError}
                    <NextLink href="/forgot-password">
                      <Link>Reset again</Link>
                    </NextLink>
                  </Flex>
                </Alert>
              </Box>
            ) : null}

            <InputField
              name="newPassword"
              placeholder="Enter new password..."
              label="New password"
              type="password"
            />
            <Button
              type="submit"
              colorScheme="teal"
              mt={3}
              isLoading={isSubmitting}
            >
              Change password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

// Not needed because we can access the query param directly through the router
// ChangePassword.getInitialProps = ({ query }) => {
//   return {
//     token: query.token as string,
//   };
// };

export default withUrqlClient(createUrqlClient)(ChangePassword);
