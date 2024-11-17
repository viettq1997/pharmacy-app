import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Button, Select, Space, Spin} from 'antd';
import type { SelectProps } from 'antd';
import debounce from 'lodash/debounce';
import {PlusOutlined} from "@ant-design/icons";
import {atomSelector} from "@/states/selector.ts";
import {useAtomValue} from "jotai/index";

export interface SearchApiProps<ValueType = any>
  extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
  fetchOptions?: (search: string) => Promise<ValueType[]>;
  debounceTimeout?: number;
  showButtonAdd?: boolean,
  selectorState?: string,
  options?: any[],
  onAdd?: () => void,
}

export function SearchApi<
  ValueType extends { key?: string; label: React.ReactNode; value: string | number } = any,
>({ fetchOptions, debounceTimeout = 800, onAdd, showButtonAdd, ...props }: SearchApiProps<ValueType>) {
  const [fetching, setFetching] = useState(false);
  const selectorState = useAtomValue(atomSelector)
  const [options, setOptions] = useState<ValueType[]>(props.options || []);
  const fetchRef = useRef(0);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);

      if(!fetchOptions) {
        setOptions(props?.selectorState ? selectorState[props.selectorState] || [] : props.options || []);
        setFetching(false);
        return
      }
      fetchOptions(value).then((newOptions) => {
        setFetching(false);
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }

        setOptions(newOptions);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);
  useEffect(() => {
    if(!options.length) {
      debounceFetcher('')
    }
  }, []);
  useEffect(() => {
    if(props?.selectorState) {
      setOptions(selectorState[props.selectorState] || []);
      if(props.onChange && selectorState[props.selectorState]?.length) {
        props.onChange(selectorState[props.selectorState][0] as any, selectorState[props.selectorState]);
      }
    }
  }, props?.selectorState ? [selectorState[props.selectorState]] : []);

  return (
      <Space.Compact style={{ width: '100%' }}>
        <Select
            labelInValue
            filterOption={false}
            onSearch={debounceFetcher}
            placeholder={props.placeholder}
            notFoundContent={fetching ? <Spin size="small" /> : null}
            {...props}
            options={options}
        />
        {showButtonAdd && <Button type="primary" onClick={onAdd}><PlusOutlined/></Button>}
      </Space.Compact>
  );
}
