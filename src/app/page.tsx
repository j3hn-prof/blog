import PostList from './components/PostList';
import TitledBox from './components/TitledBox';
import { TypedTextWithCursor } from './components/TypedTextWithCursor';

export default function Page() {
  return (
    <div className='flex-box-c'>
      <h1>
        <TypedTextWithCursor text={["Hi!"," I'm j3hn."," Good to have you."]} speed={75} pause={500} />
      </h1>

      <TitledBox title='Writing'>
        <PostList/>
      </TitledBox>
    </div>
  )
}
