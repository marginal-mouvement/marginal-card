// eslint-disable-next-line ts/no-empty-object-type
export interface Serializer<In, Out = {}> {
  serialize(input: In): Out;
  deserialize(input: Out): In;
}
