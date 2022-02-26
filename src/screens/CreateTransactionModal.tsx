import { AmountInput, SelectInput, TextInput } from "components";
import { useForm, FormProvider } from "react-hook-form";
import { ScreenProps } from "navigation";
import { TransactionUpdateDto } from "models";
import tw from "tailwind-react-native-classnames";
import React, { useEffect, useState } from "react";
import { accountDictionary } from "dictionaries";
import { Button, KeyboardAvoidingView, ScrollView } from "react-native";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { transactionSlice, useActions, useAllUserCategories } from "store";

type FormState = TransactionUpdateDto;

const getResolver = () =>
  yupResolver<yup.SchemaOf<FormState>>(
    yup.object({
      account: yup.string().required(),
      amount: yup.number().required(),
      category: yup.string().required(),
      party: yup.string().required(),
      currency: yup.string().required()
    })
  );

export function CreateTransactionModal({ navigation }: ScreenProps) {
  const [saveAvailable, setSaveAvailable] = useState(true);
  const { createItem } = useActions(transactionSlice.actions);
  const categories = useAllUserCategories();

  console.log("categories", categories);

  const formMethods = useForm<FormState>({
    defaultValues: { currency: "RUB" },
    resolver: getResolver()
  });

  const onSubmit = async (form: FormState) => {
    if (!(await formMethods.trigger())) return;
    setSaveAvailable(false);
    createItem(form);
    navigation.goBack();
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title={"Save"}
          onPress={() => onSubmit(formMethods.getValues())}
          disabled={!saveAvailable}
        />
      )
    });
  }, []);

  return (
    <FormProvider {...formMethods}>
      <KeyboardAvoidingView
        behavior="padding"
        enabled
        keyboardVerticalOffset={100}
        style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}
      >
        <ScrollView style={styles.inputWrapper}>
          <AmountInput<FormState>
            style={[styles.input, styles.firstInput]}
            name={"amount"}
            label={"Amount"}
            autoComplete={false}
          />

          <TextInput<FormState>
            style={styles.input}
            label={"Party"}
            autoComplete={false}
            name={"party"}
          />

          <TextInput<FormState>
            style={[styles.input, tw.style("hidden")]}
            label={"Currency"}
            autoComplete={false}
            disabled
            defaultValue={"RUB"}
            name={"currency"}
          />

          <SelectInput<FormState>
            options={categories}
            name={"category"}
            autoComplete={false}
            label={"Category"}
            style={styles.input}
          />

          <SelectInput<FormState>
            options={accountDictionary}
            name={"account"}
            autoComplete={false}
            label={"Account"}
            style={styles.input}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </FormProvider>
  );
}

const styles = {
  inputWrapper: tw.style("flex"),
  input: tw.style("my-3"),
  firstInput: tw.style("mt-4"),
  chipWrapper: tw.style("flex flex-wrap flex-row"),
  chip: tw.style("mx-1")
};
