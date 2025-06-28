import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";

interface Props {
  text: string;
  setText: (text: string) => void;
}

const TextInputArea: React.FC<Props> = ({ text, setText }) => (
  <Card className="bg-[#1e1e2e] border border-[#313244] shadow-none">
    <CardHeader>
      <CardTitle className="text-xl flex items-center gap-2 text-[#cdd6f4]">
        <FileText className="h-5 w-5 text-[#89b4fa]" /> or Write Text
      </CardTitle>
    </CardHeader>
    <CardContent>
      <Textarea
        placeholder="Paste or type your content here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="h-48 bg-[#1e1e2e] border border-[#313244] text-[#cdd6f4] placeholder:text-[#f2cdcd] resize-none rounded-md p-4"
      />
      <p className="text-sm text-[#f2cdcd] mt-2">{text.length} characters</p>
    </CardContent>
  </Card>
);

export default TextInputArea;
