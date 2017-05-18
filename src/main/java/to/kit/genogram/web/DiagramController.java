package to.kit.genogram.web;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import to.kit.genogram.entity.Diagram;
import to.kit.genogram.service.DiagramService;
import to.kit.genogram.web.form.DiagramForm;
import to.kit.genogram.web.form.ResultForm;

/**
 * ダイアグラムコントローラー.
 * @author H.Sasai
 */
@Controller
@RequestMapping("/diagram")
public class DiagramController {
	@Autowired
	private DiagramService diagramService;

	/**
	 * 一覧取得.
	 * @return 一覧
	 */
	@RequestMapping("/list")
	@ResponseBody
	public List<Diagram> list() {
		return this.diagramService.list();
	}

	/**
	 * 編集画面表示.
	 * @param model モデル
	 * @param documentId ドキュメントID
	 * @return 画面名
	 */
	@RequestMapping("/edit/{id}")
	public String edit(Model model, @PathVariable("id") String documentId) {
		Diagram diagram = this.diagramService.detail(documentId);

		if (diagram == null) {
			diagram = new Diagram();
		}
		model.addAttribute("diagram", diagram);
		return "edit";
	}

	/**
	 * 保存.
	 * @param form フォーム
	 * @return 結果フォーム
	 */
	@RequestMapping("/save")
	@ResponseBody
	public ResultForm save(DiagramForm form) {
		ResultForm result = new ResultForm();
		Diagram entity = new Diagram();
		BeanUtils.copyProperties(form, entity);
		Diagram saved = this.diagramService.save(entity);

		result.setInfo(saved);
		result.setOk(true);
		return result;
	}
}
