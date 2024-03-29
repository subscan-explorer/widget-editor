/**
 *  Copyright (c) 2021 GraphQL Contributors.
 *
 *  This source code is licensed under the MIT license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import { GraphQLArgument } from 'graphql';
import TypeLink from './TypeLink';
import DefaultValue from './DefaultValue';

type ArgumentProps = {
  arg: GraphQLArgument;
  showDefaultValue?: boolean;
};

export default function Argument({ arg, showDefaultValue }: ArgumentProps) {
  return (
    <span className="arg">
      <span className="arg-name">{arg.name}</span>
      {': '}
      <TypeLink type={arg.type} />
      {showDefaultValue !== false && <DefaultValue field={arg} />}
    </span>
  );
}
