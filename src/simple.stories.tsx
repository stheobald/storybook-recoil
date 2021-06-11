import React, { useEffect } from 'react'
import { Story } from '@storybook/react'
import { atom, RecoilRoot, useRecoilValue, useSetRecoilState } from 'recoil'

const recoilAtom = atom({
  key: 'atom',
  default: { exclamation: 'default value' },
})

const useRecoilHook = () => {
  const setAtom = useSetRecoilState(recoilAtom)
  const set = (someValue) => {
    console.log('hook value', someValue)
    setAtom(someValue)
  }
  return { set }
}

const FinalStoryComponent = () => {
  const atomState = useRecoilValue(recoilAtom)
  return (
    <>
      <p>Story Component</p>
      <p>{JSON.stringify(atomState)}</p>
    </>
  )
}

const RecoilRootDecorator = (Story) => (
  <RecoilRoot>
    <Story />
  </RecoilRoot>
)

const Stories = {
  component: FinalStoryComponent,
  title: 'recoil/simple',
} //as Meta

export default Stories

// // This definition breaks react compiliation for Storybook
// const SetDecorator = (someValue: object) => (Story) => {
//   const { set } = useRecoilHook()
//   useEffect(() => {
//     set(someValue)
//   }, [set])
//   return <Story />
// }

// const SetDecorator = (someValue: object) => {
//   const InnerComponent = (Story) => {
//     const { set } = useRecoilHook()
//     useEffect(() => {
//       set(someValue)
//     }, [set])
//     return <Story />
//   }
  
//   return InnerComponent
// }

//This definition has a React Function Component signature, so it's fine, but doesn't work in the storybook context.
const NonStorySetDecorator = (someValue: object) => {
  const { set } = useRecoilHook()
  useEffect(() => {
    set(someValue)
  }, [set])
}

const SetDecorator = (Story, { parameters }) => {
  const { recoil: recoilValue } = parameters;
  const Wrapper = () => {
    const { set } = useRecoilHook()
    useEffect(() => {
      set(recoilValue)
    }, [set])
    return <Story />
  }
  return <Wrapper />;
}


const Template: Story = (args) => <FinalStoryComponent {...args} />

export const WithRecoilRootOnly = Template.bind({})
WithRecoilRootOnly.decorators = [RecoilRootDecorator]

// This story _should_ demonstrate how we can set a recoil value for _each_ story, as storybook is designed to facilitate.
export const WithRecoilRootAndValues = Template.bind({})
WithRecoilRootAndValues.parameters = {recoil: { exclamation: 'hooray!' }}
WithRecoilRootAndValues.decorators = [
  RecoilRootDecorator,
  SetDecorator
  // SetDecorator({ exclamation: 'hooray' }),
]

