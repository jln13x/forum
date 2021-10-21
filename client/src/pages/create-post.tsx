import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { useCreatePostMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useIsAuth } from "../utils/useIsAuth";

const CreatePost: React.FC<{}> = ({}) => {
  const router = useRouter();
  useIsAuth();

  const [, createPost] = useCreatePostMutation();

  const initialValues = {
    title: "",
    text: "",
  };

  return (
    <Layout>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values, { setErrors }) => {
          const { error } = await createPost({ input: values });
          // If there was a error, it will be handled by the global handler defined from urql (errorExchange)
          if (!error) router.push("/");
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="title"
              placeholder="Enter your title..."
              label="Title"
            />
            <Box mt={4}>
              <InputField name="text" placeholder="..." label="Body" textarea />
            </Box>

            <Button
              type="submit"
              colorScheme="teal"
              mt={3}
              isLoading={isSubmitting}
            >
              Create Post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
