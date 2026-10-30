export default function TitledBox({children, title}: {title:string}) {
  return (
    <div>
      <h4 className="box-title">{title}</h4>
      <div className="bordered-box">
        {children}
      </div>
    </div>
  )
}
